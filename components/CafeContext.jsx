import React, { createContext, useState } from 'react';

export const CafeContext = createContext();

export const CafeProvider = ({ children }) => {
    const [cafePoiList, setCafePoiList] = useState([]);
    const [cafeList, setCafeList] = useState([]);

    function updateCafe(updatedCafe) {
        setCafePoiList((prevPoiList) => prevPoiList.map((cafe) => (cafe.id === updatedCafe.id ? updatedCafe : cafe))
        );
        setCafeList([updatedCafe]);
    }

    return (
        <CafeContext.Provider value={{ cafePoiList, setCafePoiList, cafeList, setCafeList, updateCafe }}>
            {children}
        </CafeContext.Provider>
    );
};
