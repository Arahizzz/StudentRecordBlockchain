import React from 'react';
import { Center } from "@chakra-ui/layout"
import { Spinner } from "@chakra-ui/spinner"


export default function Loader() {
    return <Center h="100%"><Spinner/></Center>
}