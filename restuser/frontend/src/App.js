import './App.css';
import Button from 'react-bootstrap/Button';
import {DataManager, Query, JsonAdaptor} from '@syncfusion/ej2-data';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject } from '@syncfusion/ej2-react-grids';
import {Edit, Toolbar} from '@syncfusion/ej2-grids';
import Library from './datasrc';
import axios from 'axios';
import React from 'react';



class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //example local data to post to remote.
      library: Library,
      books : [],
      lselectedBooks: [], //library grid selected items
      sselectedBooks: [], //book shelf grid selected items
      settings: {mode: 'Row', type: "multiple"}, //grids' selection settings
      toolbarOptions: ['Edit', 'Update', 'Cancel'], //toolbar buttons
      editSettings: {allowEditing: true, allowAdding: false, allowDeleting: false},
      dateTimeEditingParams: {params: {format: 'yyyy-dd-MM'}},
    };


    // @todo refactor class using react.createClass.
    this.listBooks = this.listBooks.bind(this);
    this.getBook = this.getBook.bind(this);
    this.rowSelected = this.rowSelected.bind(this);
    this.rowDeselected = this.rowDeselected.bind(this);
    this.postBooks = this.postBooks.bind(this);
    this.deleteBooks = this.deleteBooks.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.updateBooks = this.updateBooks.bind(this);

    /** remote link to the django rest api, default port is used */
    this.remoteUrl = "http://localhost:8000/books/";

    /** Used for owner column, multiple put demonstration */
    this.username = "Aryan";
}


  // Fetches all books from remote and lists them in bookshelf
  //grid.
  listBooks() {
    let data = [];
    //reset selections
    this.setState({sselectedBooks: []});

    axios.get(this.remoteUrl)
      .then(res => {
        //utilize syncfusion's DataManager for easier process and better
        //integration with Grids.
        data = new DataManager({ json: res.data, adaptor: new JsonAdaptor })
        .executeLocal(new Query().take(res.data.length));
        this.setState({
          books: data
        });
      }).catch(err => {console.log(err)});
      console.log(this.state.books);
  }
  
  //fetches a single book from remote.
  async getBook(id)
  {
    try
    {
      return (await axios.get(`${this.remoteUrl}${id}`)).data;
    } catch(err)
    {
      console.error(err);
    }
  }

  //posts all books selected in library grid to the remote.
  //addBtn click handler.
  async postBooks()
  {
    let result;
    let books = this.state.lselectedBooks;
    //change owners' name.
    books.map((book) => {
      book.owner = this.username;
    });
    if (books.length)
      result = (await axios.post(this.remoteUrl, books));

    this.listBooks();
  }

  //Grids' row selection event handlers
  async rowSelected(args, caller)
  {
    let _books;
    if (caller === "bookshelf_grid")
      _books = this.state.sselectedBooks;
    else if (caller === "library_grid")
      _books = this.state.lselectedBooks;

    if (args.isHeaderCheckboxClicked) //all select
      _books = args.data;
    else //single select
      if (!_books.includes(args.data))
        _books.push(args.data);
    
    if (caller === "bookshelf_grid")
      this.setState({sselectedBooks: _books});
    else if (caller === "library_grid")
      this.setState({lselectedBooks: _books});
  }

  async rowDeselected(args, caller)
  {
    let _books;
    if (caller === "bookshelf_grid")
      _books = this.state.sselectedBooks;
    else if (caller === "library_grid")
      _books = this.state.lselectedBooks;

    if (args.isHeaderCheckboxClicked) //all select
      _books = [];
    else //single select
      if (_books.includes(args.data))
        _books.splice(_books.indexOf(args.data), 1);

    if (caller === "bookshelf_grid")
      this.setState({sselectedBooks: _books});
    else if (caller === "library_grid")
      this.setState({lselectedBooks: _books});
  }
  
  /** 
   * Update edited books in bookshelf grid. Note that
   * remote supports multiple put requests at once.
   */
  async updateBooks(books)
  {
    let result = await axios.put(this.remoteUrl, books);
    this.listBooks();
  }

  //deletes selected books in the bookshelf grid both from
  //remote and the grid itself.
  async deleteBooks()
  {
    let id = [];
    this.state.sselectedBooks.map((book) => {
      id.push(book.id);
    });
    let result = (await axios.delete(this.remoteUrl, {data: id}));
    console.log(result);
    this.listBooks();
  }

  async clickHandler(args)
  {
    if (args.item.id == 'bookshelf_update')
    {
      //update all rows in remote
      this.updateBooks(this.state.books);
    }
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
        <script src="https://unpkg.com/react/umd/react.production.min.js" crossorigin></script>
        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
          crossorigin></script>
        <script
          src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossorigin></script>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
        <h1>Bookshelf Test (List Serializer usage)</h1>
        <br></br>
        <h3>Select books from library and add them to your bookshelf,
          or select books from your bookshelf to delete them.</h3>
        <Button href="#bookshelf_grid">See the project</Button>

        </header>

        <body>

          <h1>Library</h1>
          <GridComponent id="library_grid" dataSource={this.state.library} selectionSettings={this.state.settings} height={315} 
              rowSelected={(args) => {this.rowSelected(args, "library_grid")}} 
              rowDeselected={(args) => {this.rowDeselected(args, "library_grid")}} >
            <ColumnsDirective>
              <ColumnDirective type='checkbox' width='50'/>
              <ColumnDirective field='id' width='120' textAlign="Left"/>
              <ColumnDirective field='name' width='150'/>
              <ColumnDirective field='publish_date' width='100'/>
              <ColumnDirective field='owner' width='100'/>
            </ColumnsDirective>
            {/* <Inject services={[ Toolbar ]} /> */}
         </GridComponent>

         <Button id='refreshBtn' variant="primary" onClick={this.listBooks} className='col-md-2'>
          Refresh
          </Button>
          <Button id='addBtn' variant="primary" onClick={this.postBooks} className='col-md-2'>
            Add to Book shelf
          </Button>
          <Button id='deleteBtn' variant="danger" onClick={this.deleteBooks} className='col-md-2'>
            Delete from Book shelf
          </Button>

          <h1>Book Shelf</h1>
          <GridComponent id="bookshelf_grid" dataSource={this.state.books} selectionSettings={this.state.settings} height={315} 
              rowSelected={(args) => {this.rowSelected(args, "bookshelf_grid")}} 
              rowDeselected={(args) => {this.rowDeselected(args, "bookshelf_grid")}}
              editSettings={this.state.editSettings}
              toolbar={this.state.toolbarOptions} toolbarClick={this.clickHandler} >
            <ColumnsDirective>
              <ColumnDirective type='checkbox' width='50'/>
              <ColumnDirective field='id' headerText='Id' width='120' textAlign="Left" isPrimaryKey={true} />
              <ColumnDirective field='name' headerText='Name' width='150' />
              <ColumnDirective field='publish_date' headerText='Publish Date' width='100' />
              <ColumnDirective field='owner' headerText='Owner' width='100' editType='datepicker' 
                  edit={this.state.dateTimeEditingParams}/>
            </ColumnsDirective>
            <Inject services={[ Toolbar, Edit ]} />
          </GridComponent>
        
        </body>

      </div>
    );
  }
}

export default App;
