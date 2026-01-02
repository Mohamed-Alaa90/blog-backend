import ImageKit from "@imagekit/nodejs";

const { IMAGE_KIT_PRIVATE_KEY, IMAGE_KIT_PUBLIC_KEY, IMAGE_KIT_URL_ENDPOINT } =
  process.env;

var image_kit = new ImageKit({
  privateKey: IMAGE_KIT_PRIVATE_KEY,
  publicKey: IMAGE_KIT_PUBLIC_KEY,
  urlEndpoint: IMAGE_KIT_URL_ENDPOINT,
});

export default image_kit;
