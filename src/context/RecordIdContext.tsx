import { createContext, Dispatch, SetStateAction } from "react";

interface RecordIdContextType {
  recordId: string;
  setRecordId: Dispatch<SetStateAction<string>>;
}

export const RecordIdContext = createContext<RecordIdContextType>({
  recordId: "840958894677311",
  setRecordId: () => {
    /* default empty */
  },
});
