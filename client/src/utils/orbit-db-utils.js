import { create } from 'ipfs-http-client';
import OrbitDb from 'orbit-db';

/**
 * @description Function used to initialize the db
 * @returns {undefined}
 */
export async function initializeOrbitDb() {
  const ipfsClient = create('http://localhost:5002');
  const orbitDb = await OrbitDb.createInstance(ipfsClient);
  const db = await orbitDb.docstore('user', { accessController: { write: [orbitDb.identity.id] }, indexBy: '_id' });
  await db.load();
  return db;
}