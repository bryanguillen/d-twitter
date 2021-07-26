import { create } from 'ipfs-http-client';
import OrbitDb from 'orbit-db';

/**
 * @description Single function responsible for initializing app stores for the application
 * @returns {Object} stores
 */
export default async function initializeAppStores(ipfsUrl) {
  const ipfsClient = create(ipfsUrl);
  const orbitDbInstance = await OrbitDb.createInstance(ipfsClient);

  const defaultStoreConfig = { accessController: { write: [orbitDbInstance.identity.id] }, indexBy: '_id' };
  const post = await orbitDbInstance.docstore('post', defaultStoreConfig);
  const user = await orbitDbInstance.docstore('user', defaultStoreConfig);

  await post.load();
  await user.load();

  return { user, post };
}