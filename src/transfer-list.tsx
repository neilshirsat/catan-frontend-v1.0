import React, { Component } from 'react';
import { Typography } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Observable } from 'rxjs';


const reorder = (list: {
    key: string,
    value: ('ORE' | 'WOOL' | 'WHEAT' | 'LUMBER' | 'BRICK')
}[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

// Move item from one list to other
//@ts-ignore
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    //@ts-ignore
    result[droppableSource.droppableId] = sourceClone;
    //@ts-ignore
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 10;

const getItemStyle = (isDragging: boolean, draggableStyle: {}) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    border: '1px solid #ccc',
    borderColor: isDragging ? '#00b0ff' : '#ccc',

    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
    borderColor: isDraggingOver ? '#00b0ff' : '#ccc',
    padding: grid,
});

export type TransferListProps = {
    keep: {
        key: string,
        value: ('ORE' | 'WOOL' | 'WHEAT' | 'LUMBER' | 'BRICK')
    }[]
    discard: {
        key: string,
        value: ('ORE' | 'WOOL' | 'WHEAT' | 'LUMBER' | 'BRICK')
    }[],
    submitObservable: Observable<void>
    stateFn: (amountInDiscard: number) => void
    submit: (keep: TransferListProps['keep'], discard: TransferListProps['discard']) => void
}

export class TransferList extends Component<TransferListProps, TransferListProps> {

    constructor(props: TransferListProps) {
        super(props);
        this.state = props;
        console.log(props);
        this.props.submitObservable.subscribe(()=>{
            this.props.submit(this.state.keep, this.state.discard);
        })
    }

    //@ts-ignore
    onDragEnd = result => {
        const { source, destination } = result;

        console.log(source);
        console.log(destination);

        if (!destination) {
            return;
        }

        // Sorting in same list
        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === "keep") {
                //@ts-ignore
                const items: TransferListProps['keep'] = reorder(
                    this.state.keep,
                    source.index,
                    destination.index
                );

                this.setState(state => {
                    return {
                        ...state,
                        keep: items,
                    }
                });
            }
            if (source.droppableId === "discard") {
                //@ts-ignore
                const items: TransferListProps['discard'] = reorder(
                    this.state.discard,
                    source.index,
                    destination.index
                );

                this.setState(state => {
                    return {
                        ...state,
                        discard: items,
                    }
                });
            }
        }
        // Interlist movement
        else {
            if (source.droppableId === "keep") {
                const result = move(
                    this.state.keep,
                    this.state.discard,
                    source,
                    destination
                );
                console.log(result);
    
                //@ts-ignore
                //(result.keep).filter(x=>x!==undefined)
                //@ts-ignore
                //(result.discard).filter(x=>x!==undefined)
    
                this.setState({
                    //@ts-ignore
                    keep: result.keep,
                    //@ts-ignore
                    discard: result.discard
                });
            }
            
            if (source.droppableId === "discard") {
                const result = move(
                    this.state.discard,
                    this.state.keep,
                    source,
                    destination
                );
                console.log(result);
    
                //@ts-ignore
                //(result.keep).filter(x=>x!==undefined)
                //@ts-ignore
                //(result.discard).filter(x=>x!==undefined)
    
                this.setState({
                    //@ts-ignore
                    keep: result.keep,
                    //@ts-ignore
                    discard: result.discard
                });
            }
        }
    };

    componentDidUpdate() {
        this.props.stateFn(this.state.discard.length);
    }

    render() {
        return (
            <div style={{ 'display': 'flex', flexDirection: 'row' }}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="drag-half-panel">
                        <Typography.Text strong>Keep</Typography.Text>
                        <Droppable droppableId="keep">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className="keep"
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.keep.map((item, index) => (
                                        item !== undefined ? 
                                        <Draggable
                                            key={item.key}
                                            draggableId={item.key}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    //@ts-ignore
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style!
                                                    )}>
                                                    <div className='game-card'>
                                                        {item.value}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                        : <></>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="drag-half-panel" >
                        <Typography.Text strong>Discard</Typography.Text>
                        <Droppable droppableId="discard">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className="discard"
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.discard.map((item, index) => (
                                        item !== undefined ? 
                                        <Draggable
                                            key={item.key}
                                            draggableId={item.key}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    //@ts-ignore
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style!
                                                    )}>
                                                    {item.value}
                                                </div>
                                            )}
                                        </Draggable>
                                        : <></>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        );
    }
}