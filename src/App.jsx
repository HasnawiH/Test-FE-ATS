import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const baseApi = `http://202.157.176.100:3000`
const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [harbors, setHarbors] = useState([]);
  const [currentCountrie, setcurrentCountrie] = useState(null);
  const [currentHarbor, setcurrentHarbor] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [product, setProduct] = useState(null);

  const handleFetchCountry = async () => {
    try {
      const response = await axios.get(`${baseApi}/negaras`);
      if (response) {
        setCountries(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchHarbor = async () => {
    const filter = `{ "where": { "id_negara": ${currentCountrie}}}`
    try {
      const response = await axios.get(`${baseApi}/pelabuhans?filter=${filter}`);
      if (response) {
        setHarbors(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchProduct = async () => {
    const filter = `{ "where": { "id_pelabuhan": ${currentHarbor}}}`
    try {
      const response = await axios.get(`${baseApi}/barangs?filter=${filter}`);
      if (response) setListProduct(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilterProduct = (id) => {
    let temp = null
    listProduct.forEach((item) => {
      if (item.id_barang === Number(id)) temp = item
    });
    setProduct(temp)
  }

  useEffect(() => {
    handleFetchCountry();
  }, []);

  useMemo(() => {
    if (currentCountrie !== null) handleFetchHarbor()
  }, [currentCountrie]);

  useMemo(() => {
    if (currentHarbor !== null) {
      handleFetchProduct()
    }
  }, [currentHarbor]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex" }}>
        <div style={{ width: " 10rem" }}>NEGARA</div>
        <div>
          <select onChange={(e) => setcurrentCountrie(e.target.value)}>
            <option>Pilih Negara</option>
            {countries.map(country => (
              <option key={country.id_negara} value={country.id_negara}>
                {country.nama_negara}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex" }}>
        <div style={{ width: " 10rem" }}>PELABUHAN</div>
        <div>
          <select onChange={(e) => setcurrentHarbor(e.target.value)}>
            <option>Pilih Pelabuhan</option>
            {harbors.map(harbor => (
              <option key={harbor.id_pelabuhan} value={harbor.id_pelabuhan}>
                {harbor.nama_pelabuhan}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex" }}>
        <div style={{ width: " 10rem" }}>BARANG</div>
        <div>
          <select onChange={(e) => handleFilterProduct(e.target.value)}>
            <option>Pilih Barang</option>
            {listProduct.map(item => (
              <option key={item.id_barang} value={item.id_barang}>
                {item.nama_barang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {product &&
        <div style={{width: "100%"}}>
          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <div style={{ width: " 10rem" }}></div>
            <div>
              <div style={{fontSize: "2rem", }}>{product?.description}</div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <div style={{ width: " 10rem" }}>DISKON</div>
            <div>
            <div>{product?.diskon} %</div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <div style={{ width: " 10rem" }}>HARGA</div>
            <div>
            <div>{product?.harga}</div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <div style={{ width: " 10rem" }}>TOTAL</div>
            <div>
            <div>Rp. {(product.diskon / 100) * (product.harga)}</div>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default Countries;