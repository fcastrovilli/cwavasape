# Pinterest Visualizer

This is a Sveltekit project designed to scrape data from Pinterest boards and visualize the results in a meaningful way.

[`image-js`](https://github.com/image-js/image-js) and [`resemblejs`](https://github.com/rsmbl/Resemble.js) are involved for image analysis.

## Usage

The first step is to create a `.env` file in the root directory of the project and add the following variable:

```sh
PINTEREST_USERNAME="your-pinterest-username"
```

Replace `your-pinterest-username` with the username of the user you want to scrape.

Install the dependencies:

```sh
pnpm install
```

Then start the development server:

```sh
pnpm run dev
```

## Deployment

The application is designed to be deployed to [Vercel](https://vercel.com) and the necessary configuration files are included. Simply fork this repository and add it to your Vercel account.

> [!IMPORTANT]
> Don't forget to set the `PINTEREST_USERNAME` environment variables in the Vercel project settings.
