const API_PRODUCT =
  "https://shopee.vn/api/v4/pdp/get_pc?item_id=[ITEM_ID]&shop_id=[SHOP]&tz_offset_minutes=420&detail_level=0&";
const shopName = "vinhanh07";
const SHOP_ID = 190041852;
async function get(url) {
  return new Promise((resolve) => {
    fetch(url, {
      headers: {
        "content-type": "application/json",
        "x-api-source": "pc",
        "x-csrftoken": "fMkV0QGEisSeYkJNUEKyODr9lY5xvvM6",
        "x-requested-with": "XMLHttpRequest",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  });
}

function sleep(second) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
}

async function post(url, headers, payload) {
  return new Promise((resolve) => {
    fetch(url, {
      method: "post",
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  });
}
var _total = 0;
var _offset = 360;
async function getProductByShop(shopId, offset) {
  console.log("craw offet ", offset);
  const payload = {
    bundle: "shop_page_category_tab_main",
    item_id: 22264227713,
    shop_id: shopId,
    limit: 30,
    offset: offset,
    upstream: "pdp",
    sort_type: 1,
    item_card_use_scene: "category_product_list_popular",
  };
  const SHOP_PRODUCT = "https://shopee.vn/api/v4/shop/rcmd_items";
  post(
    SHOP_PRODUCT,
    {
      "content-type": "application/json",
      "x-api-source": "pc",
      "x-csrftoken": "fMkV0QGEisSeYkJNUEKyODr9lY5xvvM6",
      "x-requested-with": "XMLHttpRequest",
    },
    payload
  ).then(async (res) => {
    console.log(res);
    const items = res.data.items;
    let i = 0;
    while (i < items.length) {
      const res = await fetch(
        API_PRODUCT.replace("[ITEM_ID]", items[i].itemid).replace(
          "[SHOP]",
          SHOP_ID
        ),
        {
          headers: {
            "content-type": "application/json",
            "x-api-source": "pc",
            "x-csrftoken": "fMkV0QGEisSeYkJNUEKyODr9lY5xvvM6",
            "x-requested-with": "XMLHttpRequest",
          },
        }
      );
      const data = await res.json();
      await post(
        "http://localhost:8081/save-data",
        {
          "content-type": "application/json",
          mode: "no-cors",
        },
        { data: data, offset: _offset, item_id: items[i].itemid }
      );
      await sleep(3);
      i++;
    }

    _total = res.data.total;
    await sleep(5);
    if (_offset < _total) {
      _offset = _offset + 30;
      getProductByShop(shopId, _offset);
    }
  });
}

getProductByShop(SHOP_ID, 360);
