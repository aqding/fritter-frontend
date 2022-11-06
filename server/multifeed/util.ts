import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Multifeed, PopulatedMultifeed } from "./model";

// Update this if you add a property to the Freet type!
type MultifeedResponse = {
  _id: string;
  authorId: string;
  content: Array<string>;
  name: string;
};

const constructMultifeedResponse = (
  multifeed: HydratedDocument<Multifeed>
): MultifeedResponse => {
  const content: Map<string, string> = new Map();
  const multifeedCopy: PopulatedMultifeed = multifeed.toObject();

  multifeedCopy.content.map((user) =>
    content.set(user.username.toString(), user._id.toString())
  );
  return {
    _id: multifeed._id.toString(),
    authorId: multifeed.authorId.toString(),
    content: multifeedCopy.content.map((user) => user.username.toString()),
    name: multifeed.name.toString(),
  };
};

export { constructMultifeedResponse };
