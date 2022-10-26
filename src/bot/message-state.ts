import { Message } from "@grammyjs/types";
import { StationConfig } from "../stations";

export interface MessageStateFnMap {
  [identifier: string]:
  {
    0: (stationConfigs: StationConfig[], message: Message) => any;
    [cycle: number]: (
      stationConfigs: StationConfig[],
      message: Message,
      data: string
    ) => any;
  }
};

export interface MessageState {
  identifier: string;
  state: number;
  data: string;
}

export const createMessageState = (
  identifier: string,
  state: number,
  data: string
): string => {
  return `${identifier},${state},${data}`;
};

export const parseMessageState = (text: string): MessageState | null => {
  const stateArr = text.split(",");
  if (!stateArr || stateArr.length !== 3) {
    return null;
  }

  const [identifier, state, data] = stateArr;
  return { identifier, state: Number(state), data };
};
