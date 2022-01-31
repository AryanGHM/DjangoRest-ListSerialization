/**
 * 
 * @note We are gonna still use syncfusion and focus on refactoring 
 * on refactor branch for now. Will change to MUI in a later branch
 * 
 */
import './App.css';
import Button from 'react-bootstrap/Button';



import Library from './datasrc';
import axios from 'axios';
import React from 'react';
import crud from './crud/crud';
import BooksGrid from './components/BookshelfGrid';



class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      books : [],
      library_selection : [],
      bookshelf_selection : []
    };

}

  render () {
    return (
      <div className="App">
        <header className="App-header">

        <h1>Bookshelf Test (List Serializer usage)</h1>
        <br></br>
        <h3>Select books from library and add them to your bookshelf,
          or select books from your bookshelf to delete them.</h3>
        <Button href="#LibraryHeader">See the project</Button>


        </header>

        <body>

          <h1 id="LibraryHeader">Library</h1>
          <BooksGrid datasrc={Library} selectionDict={this.state.library_selection} 
            editSettings={{allowEditing: false, allowAdding: false, allowDeleting: false}}/>

         <Button id='refreshBtn' variant="primary" 
            onClick={async () => {this.setState({books: await crud.listBooks()});}} 
            className='col-md-2'>
          Refresh
          </Button>
          <Button id='addBtn' variant="primary" 
            onClick={() => {
              this.setState({books: this.state.books.concat(this.state.library_selection)});
            }
            } 
            className='col-md-2'>
            Add to Book shelf
          </Button>
          <Button id='updateBtn' variant="primary" 
            onClick={async () => {crud.updateBooks(this.state.books)}}>
            Update Bookshelf
          </Button>

          <h1>Book Shelf</h1>
          <BooksGrid datasrc={this.state.books} selectionDict={this.state.bookshelf_selection}/>
        
        </body>

      </div>
    );
  }
}

export default App;
