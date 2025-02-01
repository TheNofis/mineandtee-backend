import { productList, shopList } from "../../utils/api/shopInfo.js";

import ResponseModule from "../../utils/module/Response.Module.js";

class controller {
  async search(req, res) {
    const Response = new ResponseModule();
    try {
      const { text } = req.query;
      Response.start();

      const ShopList = await shopList();
      const ProductList = await productList();

      const alikeProduct = ProductList.filter(
        (e) =>
          e.Product.toLowerCase().includes(text.toLowerCase()) ||
          e.Category.toLowerCase().includes(text.toLowerCase()),
      ).map((e) => {
        return {
          type: "product",
          title: e.Product,
          image: e.ImageLink,
          tags: e.Category,
          price: e.FullPrice,
          measUnit: e.MeasUnit,
          id: e.ProductID,
        };
      });
      const alikeShop = ShopList.filter(
        (e) =>
          e.Name.toLowerCase().includes(text.toLowerCase()) ||
          e.ShopID.toLowerCase().includes(text.toLowerCase()),
      ).map((e) => {
        return {
          type: "shop",
          title: e.Name,
          city: e.City,
          gps: e.GPS,
          id: e.ShopID,
        };
      });

      return res.json(
        Response.success([...alikeProduct, ...alikeShop], "Search success"),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}
export default new controller();
