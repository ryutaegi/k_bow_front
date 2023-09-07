import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.50.45.14:3001/list';

const Notice_list = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [inputData, SetInput] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get(API_URL);
            //console.log(response);
            const _inputData = response.data.map((rowData) => ({
                ID: rowData.ID,
                title: rowData.title,
                content: rowData.content,
            }));
            SetInput(_inputData);
            console.log(inputData);
        };
        fetchPosts();
    }, []);

   

    return (
        <View style={{ padding: 20 }}>
             
            {inputData.map((notice, index) => (
                    <View key={index} style={{alignContent : 'center', borderWidth : 1, marginBottom : 5, flexDirection : 'row'}}>
                        <Text style={{ width: '10%' }}>{index}</Text>
                        <Text style={{ width: '30%' }}>{notice.title}</Text>
                        <Text style={{ width: '60%' }}>{notice.content}</Text>
                    </View>
                ))}
           
        </View>
    );
};

export default Notice_list;
