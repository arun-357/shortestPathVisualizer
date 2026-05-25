import React from 'react';
import { Icons } from './Icons';
import {
  DrawerCloseBtn,
  DrawerHandle,
  DrawerHandleWrap,
  DrawerHeader,
  DrawerOverlay,
  DrawerScroll,
  DrawerSheet,
  DrawerTitle,
} from './Drawer.styled';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => (
  <>
    <DrawerOverlay $open={open} onClick={onClose} />
    <DrawerSheet $open={open}>
      <DrawerHandleWrap>
        <DrawerHandle />
      </DrawerHandleWrap>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerCloseBtn onClick={onClose}>{Icons.x}</DrawerCloseBtn>
      </DrawerHeader>
      <DrawerScroll>{children}</DrawerScroll>
    </DrawerSheet>
  </>
);
