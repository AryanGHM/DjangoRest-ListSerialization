import { ColumnDirective, ColumnsDirective, GridComponent, Inject } from '@syncfusion/ej2-react-grids';
import crud from "../crud/crud";
import {Edit, Toolbar} from '@syncfusion/ej2-grids';

function BooksGrid(props)
{
    const gridProps = {
        dataSource: props.datasrc, 
        selectionSettings: {mode: 'Row', type: "multiple"}, 
        height: 315, 
        rowSelected: (args) => rowSelected(args),
        rowDeselected: (args) => {rowDeselected(args)},
        editSettings: props.editSettings ? props.editSettings : {allowEditing: true, 
            allowAdding: false, 
            allowDeleting: true} ,
        toolbar: ['Edit', 'Delete', 'Update',  'Cancel'],
        toolbarClick: clickHandler
    };
    const dateTimeEditingParams = {params: {format: 'yyyy-dd-MM'}};
    
    var datasrc = props.datasrc;
    var selection = props.selectionDict;

    async function clickHandler(args)
    {
        datasrc.push(...args.data);
    }

    async function rowSelected(args)
    {

        if (args.isHeaderCheckboxClicked) //all select
        {
            selection.splice(0, selection.length);
            args.data.foreach((item) => {
                selection.push(item);
            }); 
        }
        else
            if (!selection.includes(args.data))
                selection.push(args.data);
    }

    async function rowDeselected(args)
    {
        if (args.isHeaderCheckboxClicked) //all select
            selection.splice(0, selection.length);
        else
            if (selection.includes(args.data))
                selection.splice(selection.indexOf(args.data), 1);
    }
    
    return (
        <GridComponent {...gridProps}>
            <ColumnsDirective>
                <ColumnDirective type='checkbox' width='50'/>
                <ColumnDirective field='id' headerText='Id' width='120' textAlign="Left" isPrimaryKey={true} />
                <ColumnDirective field='name' headerText='Name' width='150' />
                <ColumnDirective field='publish_date' headerText='Publish Date' width='100' />
                <ColumnDirective field='owner' headerText='Owner' width='100' editType='datepicker' 
                    edit={dateTimeEditingParams}/>
            </ColumnsDirective>
            <Inject services={[ Toolbar, Edit ]} />
        </GridComponent>
    );
}

export default BooksGrid;