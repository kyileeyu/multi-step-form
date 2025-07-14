import {useState} from "react";
import {BasicInfo, BookRecord, PublicOrNot, Quotes, Rating} from "@/features/bookRecord/ui";

const Book = () => {
  const [funnelStep, setFunnelStep] = useState<number>(1);


  switch (funnelStep) {
      case 1:
          return <BasicInfo/>;
      case 2:
            return <Rating/>;
      case 3:
        return <BookRecord/>;
      case 4:
            return <Quotes/>
      case 5:
          return <PublicOrNot/>;
    default:
        return <BasicInfo/>;
  }
}

export default Book;