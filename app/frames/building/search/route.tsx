import { Button } from "frames.js/next"
import { frames } from "../../frames"
import { searchJsonArray, getOpenseaData, getDetail, NFT } from '@/app/utils'
import { CardImage } from '@/app/components/Card'
import { ethers } from "ethers"

const handleRequest = frames(async (ctx: any) => {

    let searchTerm = ctx.searchParams?.searchTerm
        ? ctx.searchParams.searchTerm : ctx.message.inputText

    // there is a search term, find matches in the metadata
    if (searchTerm) {
        const searchResults = searchJsonArray(searchTerm)

        //console.log('results', searchResults)

        let page: number = ctx.searchParams?.page ? parseInt(ctx.searchParams.page) : 1
        const currentBuilding = searchResults[page-1]
        
        //console.log('currentBuilding:', currentBuilding)
        //console.log('page:', page)

        if (searchResults.length > 0) {
            return {
                image: await CardImage( searchResults[page-1] ),
                imageOptions: {
                    aspectRatio: "1:1",
                },
                textInput: "search",
                buttons: searchResults.length == 1 // just one result
                ?   [
                        <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/buy" }}>
                            Buy
                        </Button>,
                        <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/sell" }}>
                            Sell
                        </Button>,
                        <Button action="post" target="/building/search">
                            Search
                        </Button>,
                        <Button action="post" target={{ query: { searchTerm: 'random' }, pathname: "/building/search" }}>
                            Random
                        </Button>
                    ]
                :   page > 1 && searchResults.length > page // multiple results and we are somewhere in the middle
                    ?   [
                            <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/buy" }}>
                                Buy
                            </Button>,
                            <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/sell" }}>
                                Sell
                            </Button>,
                            <Button action="post" target={{ query: { page: page-1, searchTerm: searchTerm }, pathname: "/building/search" }}>
                                Prev
                            </Button>,
                            <Button action="post" target={{ query: { page: page+1, searchTerm: searchTerm }, pathname: "/building/search" }}>
                                Next
                            </Button>
                        ]
                    :   page > 1 && searchResults.length == page // multiple results and we are at the end
                        ?   [
                                <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/buy" }}>
                                    Buy
                                </Button>,
                                <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/sell" }}>
                                    Sell
                                </Button>,
                                <Button action="post" target={{ query: { page: page-1, searchTerm: searchTerm }, pathname: "/building/search" }}>
                                    Prev
                                </Button>,
                                <Button action="post" target="/building/search">
                                    Search
                                </Button>
                            ]
                        :   [ // multiple results and we are at the start
                                <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/buy" }}>
                                    Buy
                                </Button>,
                                <Button action="post" target={{ query: { building: JSON.stringify(currentBuilding) }, pathname: "/building/card/sell" }}>
                                    Sell
                                </Button>,
                                <Button action="post" target={{ query: { page: page+1, searchTerm: searchTerm }, pathname: "/building/search" }}>
                                    Next
                                </Button>,
                                <Button action="post" target="/building/search">
                                    Search
                                </Button>
                            ]

            }
        } else { // no results
            return { 
                image: (
                    <div tw="flex flex-col items-center justify-center">
                        <h3>Nothing came up!</h3>
                        <h4>try Berlin, that always works</h4>
                    </div>
                ),
                imageOptions: {
                    aspectRatio: "1:1",
                },
                textInput: "search",
                buttons: [
                    <Button action="post" target="/building/search">
                        Search
                    </Button>,
                    <Button action="post" target={{ query: { searchTerm: 'random' }, pathname: "/building/search" }}>
                        Random
                    </Button>,
                    <Button action="post" target="/">
                        Reset
                    </Button>
                ]
            }
        }
    }

    return { 
        image: (
            <div tw="px-5 mx-auto flex flex-col items-center justify-center">
                <h3>Search for a building</h3>
                <h4 tw="text-center">or enter a keyword like 'bridge', 'Shanghai', or perhaps 'magnificent Flemish Renaissance style building'</h4>
            </div>
        ),
        imageOptions: {
            aspectRatio: "1:1",
        },
        textInput: "search",
        buttons: [
            <Button action="post" target="/building/search">
                Search
            </Button>,
            <Button action="post" target={{ query: { searchTerm: 'random' }, pathname: "/building/search" }}>
                Random
            </Button>,
            <Button action="post" target="/">
                Reset
            </Button>
        ]
    }
})

export const GET = handleRequest
export const POST = handleRequest