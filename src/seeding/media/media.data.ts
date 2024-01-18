import {
  randJobTitle,
  randNumber,
  randProductDescription,
  randUrl,
} from "@ngneat/falso";
import { Media } from "modules/media/entity/media.entity";
import { DeepPartial } from "typeorm";

export const getMediaData = () => {
  const companies: DeepPartial<Media>[] = [...Array(50).keys()].map(() => ({
    name: randJobTitle(),
    description: randProductDescription(),
    fileUrl: randUrl(),
    duration: `${randNumber({ min: 0.1, max: 2, fraction: 2 })}hr`,
  }));
  return companies;
};
