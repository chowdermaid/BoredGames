import React, { useContext, useState } from 'react';
import {
  filterSearchApi,
  addProductCollectionApi,
  collectTagsApi,
} from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useAlert } from './AlertContext';
import ShopProductCard from '../cards/ShopProductCard';
import FilteredTagsCard from '../cards/FilteredTagsCard';
import CategoriesCard from '../cards/CategoriesCard';
import {
  getPersonalCategoriesListApi,
  getPersonalMechanicsListApi,
  getPopularCategoriesListApi,
  getPopularMechanicsListApi,
  getSaleItemsApi,
} from '../api/recommenderApi';
import MechanicsCard from '../cards/MechanicsCard';

const ShopContext = React.createContext({});

export const ShopProvider = ({ children }) => {
  const { token } = useAuth();
  const { handlePopupClick, setLoading } = useAlert();
  const [search, setSearch] = React.useState('');
  const [priceSlider, setPriceSlider] = React.useState([0, 70]);
  const [yearSlider, setYearSlider] = React.useState([1, 50]);
  const [playerSlider, setPlayerSlider] = React.useState([1, 20]);
  const [ageSlider, setAgeSlider] = React.useState(18);
  const [playtimeSlider, setPlaytimeSlider] = React.useState([0, 100]);
  const [categories, setCategories] = React.useState([]);
  const [mechanics, setMechanics] = React.useState([]);
  const [curve, setCurve] = React.useState([1, 5]);
  const [depth, setDepth] = React.useState([1, 5]);
  const [shopItems, setShopItems] = useState([]);
  const [usedFilters, setUsedFilters] = React.useState([]);
  const [sortName, setSortName] = React.useState('Sort By');
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [mechanicItems, setMechanicItems] = React.useState([]);
  const [saleItems, setSaleItems] = React.useState([]);

  const difficultyNames = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Rookie' },
    { value: 3, label: 'Standard' },
    { value: 4, label: 'Expert' },
    { value: 5, label: 'Master' },
  ];

  /**
   * Gets all products data with optional sort
   */
  const getShopData = async () => {
    const data = await filterSearchApi({
      search: String(search),
      min_price: parseInt(priceSlider[0] * 5),
      max_price: parseInt(priceSlider[1] * 5),
      min_year: parseInt(yearSlider[0] + 1971),
      max_year: parseInt(yearSlider[1] + 1971),
      min_players: parseInt(playerSlider[0]),
      max_players: parseInt(playerSlider[1]),
      min_playtime: parseInt(playtimeSlider[0] * 5),
      max_playtime: parseInt(playtimeSlider[1] * 5),
      min_age: parseInt(ageSlider),
      mechanics: mechanics,
      categories: categories,
      curve_start: parseInt(curve[0]),
      curve_end: parseInt(curve[1]),
      depth_start: parseInt(depth[0]),
      depth_end: parseInt(depth[1]),
    });

    setShopItems(data);
    setLoading(false);
  };

  /**
   * Gets all products that is on sale
   */
  const getSaleShopData = async () => {
    const data = await getSaleItemsApi({});
    setSaleItems(data);
    setLoading(false);
  };

  /**
   * Function that filters products based on menu, only difference from getshopdata() is that it
   * forces the user to go back to page 1 when you search
   */
  const submitSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await filterSearchApi({
        search: String(search),
        min_price: parseInt(priceSlider[0] * 5),
        max_price: parseInt(priceSlider[1] * 5),
        min_year: parseInt(yearSlider[0] + 1971),
        max_year: parseInt(yearSlider[1] + 1971),
        min_players: parseInt(playerSlider[0]),
        max_players: parseInt(playerSlider[1]),
        min_playtime: parseInt(playtimeSlider[0] * 5),
        max_playtime: parseInt(playtimeSlider[1] * 5),
        min_age: parseInt(ageSlider),
        mechanics: mechanics,
        categories: categories,
        curve_start: parseInt(curve[0]),
        curve_end: parseInt(curve[1]),
        depth_start: parseInt(depth[0]),
        depth_end: parseInt(depth[1]),
      });
      if (data) {
        setShopItems(data);
        getUserSelectedTags();
        forceBackToPage1();
        setLoading(false);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Get shopmenu list
   */
  const getShopMenuData = async () => {
    if (token) {
      const catper = await getPersonalCategoriesListApi({ token });
      setCategoryItems(catper);
      const mecper = await getPersonalMechanicsListApi({ token });
      setMechanicItems(mecper);
    } else {
      const catpop = await getPopularCategoriesListApi({});
      setCategoryItems(catpop);
      const mecpop = await getPopularMechanicsListApi({});
      setMechanicItems(mecpop);
    }
  };

  /**
   * Displaying categories
   */
  const displayCategories = categoryItems.map((data) => (
    <CategoriesCard value={data} key={data} />
  ));

  /**
   * Displaying mechanics
   */
  const displayMechanics = mechanicItems.map((data) => (
    <MechanicsCard value={data} key={data} />
  ));

  /**
   * For scaling the sliders
   */
  function priceLabelFormat(value) {
    let scaledValue = value;

    return `$${scaledValue}`;
  }

  function playTimeLabelFormat(value) {
    let scaledValue = value;

    return `${scaledValue} mins`;
  }

  function calculateValue(value) {
    return 5 * value;
  }

  function calculateYear(value) {
    return 1971 + value;
  }

  /**
   * function that gets the tags user has changed
   */
  const getUserSelectedTags = async () => {
    const data = await collectTagsApi({
      search: String(search),
      min_price: parseInt(priceSlider[0]),
      max_price: parseInt(priceSlider[1]),
      min_year: parseInt(yearSlider[0]),
      max_year: parseInt(yearSlider[1]),
      min_players: parseInt(playerSlider[0]),
      max_players: parseInt(playerSlider[1]),
      min_playtime: parseInt(playtimeSlider[0]),
      max_playtime: parseInt(playtimeSlider[1]),
      min_age: parseInt(ageSlider),
      mechanics: mechanics,
      categories: categories,
      curve_start: parseInt(curve[0]),
      curve_end: parseInt(curve[1]),
      depth_start: parseInt(depth[0]),
      depth_end: parseInt(depth[1]),
    });
    setUsedFilters(data);
  };

  /**
   * Display all selected tags
   */
  const displayUserSelectedTags = usedFilters.map((data) => (
    <FilteredTagsCard
      tag={data.tag}
      type={data.type}
      value={data.value}
      key={data.tag}
    />
  ));

  /**
   * Removes all user selected tags
   */
  const removeAllUserSelectedTags = () => {
    setUsedFilters([]);
    setSearch('');
    setPriceSlider([0, 70]);
    setYearSlider([1, 50]);
    setPlayerSlider([1, 20]);
    setAgeSlider(18);
    setPlaytimeSlider([0, 100]);
    let i;
    for (i = 0; i < categories.length; i++) {
      categoriesChecked(categories[i]);
    }
    for (i = 0; i < mechanics.length; i++) {
      categoriesChecked(mechanics[i]);
    }
    setCategories([]);
    setMechanics([]);
    setCurve([1, 5]);
    setDepth([1, 5]);
  };

  /**
   * Function to uncheck category
   */
  const categoriesChecked = (value) => {
    const found = categories.find((a) => a === value);

    if (found) {
      return true;
    }
    return false;
  };

  /**
   * Function to uncheck mechanics
   */
  const mechanicsChecked = (value) => {
    const found = mechanics.find((a) => a === value);

    if (found) {
      return true;
    }
    return false;
  };

  /**
   * Function to handle category checkboxes
   */
  const handleCategoriesChange = (e) => {
    const checked = e.target.checked;
    const selectedValue = e.target.value;
    if (!checked) {
      setCategories(categories.filter((a) => a !== selectedValue));
    } else {
      setCategories([...categories, selectedValue]);
    }
  };

  /**
   * Function to handle mechanics checkboxes
   */
  const handleMechanicsChange = (e) => {
    const checked = e.target.checked;
    const selectedValue = e.target.value;
    if (!checked) {
      setMechanics(mechanics.filter((a) => a !== selectedValue));
    } else {
      setMechanics([...mechanics, selectedValue]);
    }
  };

  /**
   * Adds product to user collection
   */
  const addToCollection = async (handle) => {
    try {
      const data = await addProductCollectionApi({ handle, token });
      if (data) {
        handlePopupClick('Added to my collection!', 'success', 'top', 'center');
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
  };

  /**
   * Displays discounted price
   */
  const discountedPrice = (discount, price) => {
    var value = 0;
    value = price * (1 - discount);
    return value;
  };

  const hasDiscount = (discount) => {
    if (discount > 0) {
      return true;
    }
    return false;
  };

  /**
   * Function to sort products
   */
  const handleSortMenu = (filter) => {
    if (filter === 'Rank') {
      setSortName('Rank');
      shopItems.sort((a, b) => (a.rank > b.rank ? 1 : -1));
    } else if (filter === 'AZ') {
      setSortName('A-Z');
      shopItems.sort((a, b) => (a.handle > b.handle ? 1 : -1));
    } else if (filter === 'ZA') {
      setSortName('Z-A');
      shopItems.sort((a, b) => (a.handle < b.handle ? 1 : -1));
    } else if (filter === 'PriceUp') {
      setSortName('Lowest-Highest');
      shopItems.sort((a, b) => (a.price_au > b.price_au ? 1 : -1));
    } else if (filter === 'PriceDown') {
      setSortName('Highest-Lowest');
      shopItems.sort((a, b) => (a.price_au < b.price_au ? 1 : -1));
    }
    forceBackToPage1();
  };

  /**
   * Display shop products with pagination
   */
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 32;
  const pagesVisited = pageNumber * itemsPerPage;
  const displayShopProducts = shopItems
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => (
      <ShopProductCard
        imgurl={data.image_url}
        name={data.name}
        price={data.price_au}
        id={data.id}
        key={data.handle}
        instock={data.quantity}
        addToCollection={() => addToCollection(data.handle)}
        discount={discountedPrice(data.discount, data.price_au)}
        hasDiscount={hasDiscount(data.discount)}
      />
    ));

  /**
   * Display sale items
   */
  const displaySaleShopProducts = saleItems.map((data) => (
    <ShopProductCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      key={data.handle}
      instock={data.quantity}
      addToCollection={() => addToCollection(data.handle)}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
    />
  ));

  const pageCount = Math.ceil(shopItems.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const forceBackToPage1 = () => {
    setPageNumber(0);
  };

  return (
    <ShopContext.Provider
      value={{
        search,
        setSearch,
        submitSearch,
        getShopData,
        addToCollection,
        handleSortMenu,
        shopItems,
        setShopItems,
        priceSlider,
        setPriceSlider,
        yearSlider,
        setYearSlider,
        playerSlider,
        setPlayerSlider,
        playtimeSlider,
        setPlaytimeSlider,
        ageSlider,
        setAgeSlider,
        mechanics,
        setMechanics,
        categories,
        setCategories,
        curve,
        setCurve,
        depth,
        setDepth,
        sortName,
        setSortName,
        handleCategoriesChange,
        handleMechanicsChange,
        displayShopProducts,
        pageCount,
        changePage,
        pageNumber,
        forceBackToPage1,
        difficultyNames,
        calculateValue,
        priceLabelFormat,
        playTimeLabelFormat,
        displayUserSelectedTags,
        usedFilters,
        setUsedFilters,
        categoriesChecked,
        mechanicsChecked,
        removeAllUserSelectedTags,
        calculateYear,
        getShopMenuData,
        displayCategories,
        displayMechanics,
        displaySaleShopProducts,
        getSaleShopData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
