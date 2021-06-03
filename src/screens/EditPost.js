import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Alert, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import PTRView from "react-native-pull-to-refresh";
import { baseUri } from "../../env";
import NoticeBox from "../components/NoticeBox";

export default ({ navigation }) => {
    const [noticeList, setNoticeList] = useState([]);
    useEffect(() => {
        GetList();
    }, []);
    const PostDelete = async () => {
        const token = await GetToken();
    
        const config = {
          headers: { authentication: token },
        };
    
        await axios
          .delete(`${baseUri.outter_net}/api/v1/post/${props.uid}`, config)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("게시물을 삭제할 수 없습니다.");
          });
    };
    
    const confirmAlert = () => {
        Alert.alert(
          "삭제하시겠습니까?",
          "",
          [
            {
              text: "No",
              onPress: () => null,
            },
            {
              text: "Yes",
              onPress: () => PostDelete(),
            },
          ],
          { cancelable: false }
        );
      };
    const GetList = async () => {
        await axios.get(`${baseUri.outter_net}/api/v1/post`)
            .then(res => {
                console.log(res.data);
                setNoticeList(res.data);
            })
            .catch(e => {
                console.log(e);
            })
    }
    return (
        <View style={Style.Container}>
            <View style={Style.Body}>
                <PTRView
                    style={Component.List}
                    onRefresh={() => {
                        console.log('refresh!');
                        GetList();
                    }}
                    pullHeight={400}
                >

                    <ScrollView
                        contentContainerStyle={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                        }}
                    >
                        {noticeList.length === 0 && <Text style={{ marginTop: 20 }}>게시물이 없습니다.</Text>}
                        {noticeList?.map(notice => (
                            <TouchableOpacity onPress={() => confirmAlert()}>
                                <NoticeBox
                                    key={notice.uid}
                                    date={notice.date}
                                    uid={notice.uid}
                                    title={notice.title}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </PTRView>
            </View>
        </View>
    );
};

const Style = StyleSheet.create({
    Body: {
        width: '100%',
        height: '100%',
    },
});

const Component = StyleSheet.create({
    Container: {
        flex: 1,
        height: '100%',
    },
    List: {
        backgroundColor: "#687DFB"
    }
})