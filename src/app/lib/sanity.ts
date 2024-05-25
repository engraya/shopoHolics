import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'


export const client = createClient({
  // Find your project ID and dataset in `sanity.json` in your studio project
  projectId: "s28w7w9l",
  dataset: "production",
  apiVersion: '2021-08-31',
  useCdn: true
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
});



const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}