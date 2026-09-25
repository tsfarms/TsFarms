import { type FC } from 'react';
import { jackfruitParts } from '@/content/site';
import FruitParts from '@/components/sections/FruitParts';

const JackfruitParts: FC = () => (
  <FruitParts
    id="jackfruit"
    label="Nothing Goes to Waste"
    heading="Every part of the jackfruit has a purpose."
    parts={jackfruitParts}
    bgcolor="#F6F1E7"
  />
);

export default JackfruitParts;
