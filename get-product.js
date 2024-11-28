const API_PRODUCT =
  "https://shopee.vn/api/v4/pdp/get_pc?item_id=28157785073&shop_id=1062251903&tz_offset_minutes=420&detail_level=0&";
const SEO =
  "https://deo.shopeemobile.com/shopee/shopee-seometajson-live-vn/catseo/catseo-11036670.json";

  fetch(API_PRODUCT, {
    headers: {
      "content-type": "application/json",
      "x-api-source": "pc",
      "x-csrftoken": "INYuN6TGd0ol7ee3Blx7UrerQ5rn1nfs",
      "x-requested-with": "XMLHttpRequest",
    },
  })
  .then(function(serverPromise){ 
    serverPromise.json()
      .then(function(j) { 
        console.log(j); 
      })
      .catch(function(e){
        console.log(e);
      });
  })
  .catch(function(e){
      console.log(e);
    });
fetchData();
  async function get(url) {
    return new Promise((resolve) => {
      return fetch(url, {
        headers: {
          "content-type": "application/json",
          "x-api-source": "pc",
          "x-csrftoken": "INYuN6TGd0ol7ee3Blx7UrerQ5rn1nfs",
          "x-requested-with": "XMLHttpRequest",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          data.then(s => {
            console.log(s)
          });
          resolve(data);
        })
        .catch((err) => {
          console.log("Error" + err);
        });
    });
  }
