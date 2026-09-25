import { type FC } from 'react';
import { mangoParts } from '@/content/site';
import FruitParts from '@/components/sections/FruitParts';

const EveryPart: FC = () => (
  <FruitParts
    id="mangoes"
    label="Nothing Goes to Waste"
    heading="Every part of the mango has a purpose."
    parts={mangoParts}
    bgcolor="#FFFDF8"
  />
);

export default EveryPart;
