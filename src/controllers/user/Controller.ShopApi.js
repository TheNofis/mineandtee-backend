import {
  productList,
  shopBalance,
  shopList,
} from "../../utils/api/shopInfo.js";

import ResponseModule from "../../utils/module/Response.Module.js";

class controller {
  async shopbalance(req, res) {
    const Response = new ResponseModule();
    try {
      const { ShopID } = req.query;
      Response.start();
      const {
        Category,
        Group,
        ProductID,
        Product,
        Balance,
        FullPrice,
        MeasUnit,
        Callback,
      } = req.query;

      const balance = await shopBalance(ShopID);

      return res.json(
        Response.success(
          balance.map((e) => {
            if (Callback == "false") delete e.Callback;
            if (Category == "false") delete e.Category;
            if (Group == "false") delete e.Group;
            if (ProductID == "false") delete e.ProductID;
            if (Product == "false") delete e.Product;
            if (Balance == "false") delete e.Balance;
            if (FullPrice == "false") delete e.FullPrice;
            if (MeasUnit == "false") delete e.MeasUnit;

            return e;
          }),
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
  async shoplist(req, res) {
    const Response = new ResponseModule();
    try {
      const { ShopID, Name, City, GPS } = req.query;
      Response.start();

      const ShopList = await shopList();

      return res.json(
        Response.success(
          ShopList.map((e) => {
            if (ShopID == "false") delete e.ShopID;
            if (Name == "false") delete e.Name;
            if (City == "false") delete e.City;
            if (GPS == "false") delete e.GPS;

            return e;
          }),
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
  async productlist(req, res) {
    const Response = new ResponseModule();
    try {
      const {
        Category,
        Group,
        ProductID,
        Product,
        Description,
        Link,
        ImageLink,
        FullPrice,
        MeasUnit,
      } = req.query;

      Response.start();

      const ProductList = await productList();

      return res.json(
        Response.success(
          ProductList.map((e) => {
            if (Category == "false") delete e.Category;
            if (Group == "false") delete e.Group;
            if (ProductID == "false") delete e.ProductID;
            if (Product == "false") delete e.Product;
            if (Description == "false") delete e.Description;
            if (Link == "false") delete e.Link;
            if (ImageLink == "false") delete e.ImageLink;
            if (FullPrice == "false") delete e.FullPrice;
            if (MeasUnit == "false") delete e.MeasUnit;

            return e;
          }),
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}
export default new controller();
