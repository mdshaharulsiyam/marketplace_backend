import { IAuth } from "./src/apis/Auth/auth_types";
import { ICart } from "./src/apis/Cart/cart_type";
import { ICategory } from "./src/apis/Category/category_type";

declare global {
  namespace Express {
    interface Request {
      user?: IAuth;
      extra?: any;
      //  {
      //   // category?: ICategory,
      //   // cart?: ICart,

      // }
    }
  }
}
