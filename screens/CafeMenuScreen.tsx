import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { getMenus } from "../lib/menus";
import defualtCoffeeImg from "../assets/src/image/coffieeMenu_default_img.png"

/**
 * 24.10.20
 * Home 화면 -> CafeMenuScreen (카페 정보) 화면 UI 생성
 * @returns 
 */

function CafeMenuScreen({navigation, route}) {
   const { cafeInfo } = route.params;
   const [menuList, setMenuList] = useState([]); //찜한 카페 목록 저장

    useEffect(() => {
      fetchMenuList();
    }, [])
    
    //메뉴 목록 조회
    async function fetchMenuList(){
      const menuList = await getMenus(cafeInfo.id);
      setMenuList(menuList);
    }

    const renderMenuItem = ({ item }) => (
      <View style={styles.menuContainer}>
        <View style={styles.imgContainer}>

          {item.img ? 
            <Image 
              src={item.img ? item.img : defualtCoffeeImg} 
              style={styles.menuImage} 
            /> 
            : 
            <Image 
              source={item.img ? item.img : defualtCoffeeImg} 
              style={styles.menuImage} 
            />
          }
          
        </View>

        <View style={styles.textContainer}> 
          <Text style={styles.menuName}>{item.tit}</Text>
          {item.detail ?
            <Text style={styles.menuDescription}>{item.detail}</Text>
            : null
          }
          <Text style={styles.menuPrice}>{item.price}</Text>
        </View>  
      </View>
    );

    return (
      <View style={styles.container}>
        {/* 메뉴 목록 */}
        <FlatList
            data={menuList}
            renderItem={renderMenuItem}
            keyExtractor={item => item.menuId.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>메뉴 정보가 없습니다.</Text>}
            contentContainerStyle={menuList.length === 0 && styles.emptyContainer}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  menuContainer: {
    flexDirection: 'row', // 수평 방향으로 정렬
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  imgContainer : {
    width: 100, // 이미지 가로 크기
    height: 100, // 이미지 세로 크기
    borderRadius: 8,
    borderWidth: 2, // 테두리 두께
    borderColor: '#ccc', // 테두리 색상
    marginRight: 16, // 텍스트와의 간격
    padding : 12,
  },
  textContainer: {
    flex: 1, // 텍스트가 남은 공간을 채우도록 설정
  },
  menuImage: {
    width: 70, // 이미지 가로 크기
    height: 75, // 이미지 세로 크기
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
}) 

export default CafeMenuScreen;
