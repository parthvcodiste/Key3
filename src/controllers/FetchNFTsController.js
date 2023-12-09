import connectDB from "../lib/connectDB";
import nfts from "../models/nfts";
import users from "../models/users";
// import moralis from "../lib/moralis";
// import Moralis from "moralis";
import axios from "axios";

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
class FetchNFTsController {
    static async fetchNFTs(req, res) {
        try {
            // await moralis();
            const wallet_address = req?.body?.wallet_address;
            await connectDB();
            const user = await users.findOne({
                wallet_address: wallet_address
            });
            if (user) {
                const nftData = [];

                // MORALIS Implementation

                // const response = await Moralis.EvmApi.nft.getWalletNFTs({
                //     "chain": "0x1",
                //     "format": "decimal",
                //     "normalizeMetadata": true,
                //     "mediaItems": true,
                //     "address": wallet_address,
                //     limit: 100,
                // });

                // if (response.result.length > 0) {
                //     let hasMore = true;
                //     nftData.push(...response.result);
                //     if (response.pagination.cursor) {
                //         let cursor = response.pagination.cursor;
                //         while (hasMore) {
                //             const result = await Moralis.EvmApi.nft.getWalletNFTs({
                //                 "chain": "0x1",
                //                 "format": "decimal",
                //                 "normalizeMetadata": true,
                //                 "mediaItems": true,
                //                 "address": wallet_address,
                //                 limit: 100,
                //                 cursor: cursor,
                //             });
                //             nftData.push(...result.result);
                //             if (result.pagination.cursor) {
                //                 cursor = result.pagination.cursor;
                //             } else {
                //                 hasMore = false;
                //             }
                //         }
                //     }
                // }

                // if (nftData.length > 0) {
                //     console.log("Found - ", nftData.length, " nfts for wallet address - ", wallet_address);
                //     console.log("Storing in db");
                //     for (let i = 0; i < nftData.length; i++) {
                //         const nftAlreadyExists = await nfts.findOne({
                //             user_id: user?._id,
                //             token_hash: nftData[i].tokenHash,
                //         });

                //         if (nftAlreadyExists) {
                //             console.log("NFT already exists - ", nftData[i].tokenHash);
                //             await nfts.findOneAndUpdate({
                //                 _id: nftAlreadyExists?._id
                //             }, {
                //                 token_address: nftData[i].tokenAddress.lowercase.toString(),
                //                 token_id: nftData[i].tokenId,
                //                 contract_type: nftData[i].contractType,
                //                 name: nftData[i].name ? nftData[i].name : nftData[i].metadata?.name,
                //                 symbol: nftData[i].symbol,
                //                 token_uri: nftData[i].tokenUri,
                //                 metadata: JSON.stringify(nftData[i].metadata),
                //                 token_hash: nftData[i].tokenHash,
                //                 wallet_address: wallet_address,
                //             });
                //         } else {
                //             await nfts.create({
                //                 user_id: user?._id,
                //                 token_address: nftData[i].tokenAddress.lowercase.toString(),
                //                 token_id: nftData[i].tokenId,
                //                 contract_type: nftData[i].contractType,
                //                 name: nftData[i].name ? nftData[i].name : nftData[i].metadata?.name,
                //                 symbol: nftData[i].symbol,
                //                 token_uri: nftData[i].tokenUri,
                //                 metadata: JSON.stringify(nftData[i].metadata),
                //                 token_hash: nftData[i].tokenHash,
                //                 wallet_address: wallet_address,
                //             });
                //             console.log("NFT created - ", nftData[i].tokenHash);
                //         }
                //     }
                //     console.log("----------------NFT Fetching finished---------------------");
                //     await users.findOneAndUpdate({
                //         _id: user?._id,
                //     }, {
                //         is_nft_fetched: true
                //     });
                // }


                // OPENSEA Implementation

                const response = await axios.get(`https://api.opensea.io/api/v2/chain/ethereum/account/${wallet_address}/nfts?limit=2`, {
                    headers: {
                        "Accept": "application/json",
                        "x-api-key": OPENSEA_API_KEY,
                    }
                });

                if (response?.data?.nfts.length > 0) {
                    let hasMore = true;
                    nftData.push(...response?.data?.nfts);
                    if (response?.data?.next) {
                        let cursor = response?.data?.next;
                        while (hasMore) {
                            const result = await axios.get(`https://api.opensea.io/api/v2/chain/ethereum/account/${wallet_address}/nfts?limit=2&next=${cursor}`, {
                                headers: {
                                    "Accept": "application/json",
                                    "x-api-key": OPENSEA_API_KEY,
                                }
                            });
                            nftData.push(...result?.data?.nfts);
                            if (result.data?.next) {
                                cursor = result.data?.next;
                            } else {
                                hasMore = false;
                            }
                        }
                    }
                }

                if (nftData.length > 0) {
                    for (let i = 0; i < nftData.length; i++) {
                        const nftAlreadyExists = await nfts.findOne({
                            user_id: user?._id,
                            token_id: nftData[i].identifier,
                            token_address: nftData[i].contract,
                        });

                        if (nftAlreadyExists) {
                            await nfts.findOneAndUpdate({
                                _id: nftAlreadyExists?._id
                            }, {
                                token_address: nftData[i].contract,
                                token_id: nftData[i].identifier,
                                contract_type: nftData[i].token_standard,
                                name: nftData[i].name,
                                symbol: nftData[i].name,
                                metadata: nftData[i].metadata_url,
                                image: nftData[i].image_url,
                                wallet_address: wallet_address,
                            });
                        } else {
                            await nfts.create({
                                user_id: user?._id,
                                token_address: nftData[i].contract,
                                token_id: nftData[i].identifier,
                                contract_type: nftData[i].token_standard,
                                name: nftData[i].name,
                                symbol: nftData[i].name,
                                metadata: nftData[i].metadata_url,
                                image: nftData[i].image_url,
                                wallet_address: wallet_address,
                            });
                        }
                    }
                    await users.findOneAndUpdate({
                        _id: user?._id,
                    }, {
                        is_nft_fetched: true
                    });
                }
                return res.status(200).json({
                    data: nftData,
                    msg: "NFTs fetched and analysed successfully",
                });
            } else {
                return res.status(404).json({
                    msg: "User not found",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }
}
export default FetchNFTsController;