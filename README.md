# Color Swatch Code Challenge

This project is built with [React](https://react.dev/) and [Next.js](https://nextjs.org).

## Design Choices Summary

**Performance and Completeness Trade-offs:**
The biggest decision I faced was figuring out how many API calls to make. I started by sampling every 10 degrees (36 calls total) to keep things fast, but when I tested it, I only got 26 out of 45 possible colors back. Turns out The Color API has really fine-grained color boundaries, so color names can change several times even within a few degrees. I tried a few different sampling rates, but ultimately decided to query all 360 hues. Yes, it's 360 API calls, but they all run in parallel with `Promise.all()` and finish in about 1-2 seconds, which felt acceptable. Plus, I added a 500ms debounce on the inputs so you're not hammering the API while dragging sliders around. For a tool that's specifically about exploring color names, I figured getting all of them was worth an extra second or two of wait time. The alternative would've been building some complex adaptive sampling system, which seemed like overkill for this project.

**User Experience Optimizations:**
I went with both sliders and number inputs because they each solve different problems—sliders are great for quickly exploring the color space, but if you need exactly 73% saturation, typing it in is way easier than trying to hit it with a slider. The 500ms debounce turned out to be a good tradeoff: long enough that you're not making API calls while actively dragging, but short enough that it still feels snappy when you stop. I spent some time on the loading experience too—showing a skeleton grid keeps the layout from jumping around, and disabling the controls during loading prevents weird race conditions if someone keeps adjusting values. The grid uses CSS Grid with responsive breakpoints so it looks good on everything from phones to ultrawide monitors. I added logic to automatically flip the text color between black and white based on the background brightness, which was surprisingly satisfying to get working right. I also added functionality to copy the hex color to the clipboard and show a tooltip to the user when a color is clicked. I thought that was a cool addition that I've seen on other apps that have color swatches.

## Deployed on Vercel

I deployed this project live with Vercel. It can be accessed at [https://color-swatch-code-challenge.vercel.app/](https://color-swatch-code-challenge.vercel.app/).

## Getting set up locally

If you would like to set this up locally on your machine, please do the following:

First, clone this github repo.

Second, install the node modules:

```bash
  npm install
  # or
  yarn install
  # or
  pnpm install
```

Third, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
