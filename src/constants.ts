export const SMALL_AVATAR = () =>
  `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_default.jpeg`;
export const BIG_AVATAR = () =>
  `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/profile_pictures/256x256_default.jpeg`;

export const POST_PICTURES = () =>
  `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/post_pictures/default.jpeg`;
