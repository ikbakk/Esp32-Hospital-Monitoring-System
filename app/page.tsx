import Empty from '@/components/Empty';
import RoomCards from '@/components/Home/RoomCards';
import { User } from '@/type';
import { mainPathRef } from '@/utils/firebase';

import { get } from 'firebase/database';

export default async function Home() {
  const dataSnapshot = await get(mainPathRef);
  const snapshotValue = dataSnapshot.val() as User[];
  const values = snapshotValue.map((data) => data.nilai);

  return <>{!values ? <Empty /> : <RoomCards initialData={snapshotValue} />}</>;
}
