import React, {useCallback, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import Drawer from '@mui/material/Drawer';
// @ts-ignore
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {SellerProductsStore} from "@/components/SellerProfile/store";
import {SortSideBarStore} from "@/components/SellerProfile/components/SortSideBar/store";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {reOrderSellerProduct} from "@/components/SellerProfile/service";


const SortSideBarDnd = observer(function SortSideBar() {
  const items = SellerProductsStore.products
  const sellerId = SortSideBarStore.sellerId
  // console.log('{SortSideBar} sellerId: ', sellerId);

  // const getListStyle = (isDraggingOver: boolean) => ({
  //   background: isDraggingOver ? "lightblue" : "lightgrey",
  //   padding: grid,
  //   width: 250
  // });

  const grid = 8;
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    color: isDragging ? "#666" : "#333",
    border: `1px solid ${isDragging ? "#ccc" : "#aaa"}`,
    background: isDragging ? "#ffcde8" : "#e5e5e5",
    borderRadius: 6,

    // styles we need to apply on draggables
    ...draggableStyle
  });


  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    SellerProductsStore.setProducts(newItems)

    // call api
    reOrderSellerProduct(sellerId, newItems)
  }, [items, sellerId])


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: any, snapshot: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <Typography color="inherit">
                      {`${index + 1}. ${item.name}`}
                    </Typography>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
})


export default observer(function SortSideBarDrawer() {
  return (
    <Drawer
      anchor="right"
      open={SortSideBarStore.visible}
      onClose={() => SortSideBarStore.setVisible(false)}
    >
      <Box sx={{p: 2, maxWidth: 280}}>
        <Button
          variant="contained"
          onClick={() => SortSideBarStore.setVisible(false)}
          sx={{width: 30}}
        >
          Close
        </Button>
        <Typography variant="body1" sx={{mt: 1}}>
          Drag and drop to rearrange the products order<br/>
        </Typography>
        <Typography variant="body2" sx={{mt: 1}}>
          Due to Masonry view style, some products with different heights will auto change their positions.<br/>
          To ensure the correct order on the UI: <br/>
          - OR: Ensure all product will have the same height<br/>
          - OR: Use grid display instead of masonry<br/>
        </Typography>

        <Box sx={{py: 4}}>
          <SortSideBarDnd />
        </Box>
      </Box>
    </Drawer>
  )
})
