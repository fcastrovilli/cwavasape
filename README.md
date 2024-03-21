# Pinterest Visualizer

This is a Sveltekit project designed to scrape data from Pinterest boards and visualize the results in a meaningful way.

[`image-js`](https://github.com/image-js/image-js) and [`resemblejs`](https://github.com/rsmbl/Resemble.js) are involved for image analysis.

## Usage

The first thing you should do is to set up the necessary environment variables. You can do this by creating a [`.env`](command:_github.copilot.openRelativePath?%5B%22.env%22%5D '.env') file based on the provided [`.env.example`](command:_github.copilot.openRelativePath?%5B%22.env.example%22%5D '.env.example') file.

_See [Pinterest Calls](#pinterest-calls) section for more information about the required environment variables._

Start installing the dependencies:

```sh
pnpm install
```

Then start the development server:

```sh
pnpm run dev
```

## Deployment

The application is designed to be deployed to [Vercel](https://vercel.com) and the necessary configuration files are included. Simply fork this repository and add it to your Vercel account.

## Pinterest Calls

This is an example of query that Pinterest itself uses to get paginated data from a board:

```sh
https://www.pinterest.com/resource/BoardFeedResource/get/?source_url=/---USERNAME---/---BOARDNAME---/&data={"options":{"board_id":"BOARD_ID","page_size":10}}
```

The `---USERNAME---` and `---BOARDNAME---` are the username and the board name of the user you want to scrape.

To get the board id you can visit the board you want to scrape and open the `Network` tab from `Developer Tools`. Refresh the page to clear all results and filter them by `board_id`. Select a result to finally reach the board id in the `Payload` tab.
