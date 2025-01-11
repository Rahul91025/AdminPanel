import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [marketName, setMarketName] = useState("");

  const [storeAddress, setStoreAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("storeAddress", JSON.stringify(storeAddress));
      formData.append("marketName", marketName);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setStoreAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          latitude: "",
          longitude: "",
        });
        setMarketName("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding product.");
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image Upload Section */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
              />
              <input
                onChange={(e) => {
                  const files = [setImage1, setImage2, setImage3, setImage4];
                  files[index](e.target.files[0]);
                }}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>
      {/* Market Name */}
      <div className="w-full">
        <p className="mb-2">Market name</p>
        <input
          onChange={(e) => setMarketName(e.target.value)}
          value={marketName}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Enter Market Name"
          required
        />
      </div>

      {/* Product Category */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`${
                sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Store Address Section */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Store Address</h2>
        <input
          type="text"
          placeholder="Street"
          value={storeAddress.street}
          onChange={(e) =>
            setStoreAddress({ ...storeAddress, street: e.target.value })
          }
          className="w-full px-3 py-2 mb-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="City"
            value={storeAddress.city}
            onChange={(e) =>
              setStoreAddress({ ...storeAddress, city: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={storeAddress.state}
            onChange={(e) =>
              setStoreAddress({ ...storeAddress, state: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={storeAddress.postalCode}
            onChange={(e) =>
              setStoreAddress({ ...storeAddress, postalCode: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Latitude"
            value={storeAddress.latitude}
            onChange={(e) =>
              setStoreAddress({ ...storeAddress, latitude: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Longitude"
            value={storeAddress.longitude}
            onChange={(e) =>
              setStoreAddress({ ...storeAddress, longitude: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
