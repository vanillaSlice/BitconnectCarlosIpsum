import React, { Component } from 'react';

import './App.css';

import carlosImg from './carlos.png';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paragraphs: 1,
      minQuotes: 1,
      maxQuotes: 5,
      hTagLevel: 'none',
      includePTags: false,
      text: '',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
    this.handleMinQuotesChange = this.handleMinQuotesChange.bind(this);
    this.handleMaxQuotesChange = this.handleMaxQuotesChange.bind(this);
    this.handleHTagLevelChange = this.handleHTagLevelChange.bind(this);
    this.handleIncludePTagsChange = this.handleIncludePTagsChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const {
      hTagLevel,
      paragraphs,
      minQuotes,
      maxQuotes,
      includePTags,
    } = this.state;

    const includeHeadings = hTagLevel !== 'none';

    let url = '/api/text'
      + `?paragraphs=${paragraphs}`
      + `&includeHeadings=${includeHeadings}`
      + `&minQuotes=${minQuotes}`
      + `&maxQuotes=${maxQuotes}`
      + `&includePTags=${includePTags}`;

    if (includeHeadings) {
      url += `&hTagLevel=${hTagLevel}`;
    }

    fetch(url)
      .then(res => res.json())
      .then((data) => {
        let text = '';
        if (!data.text) {
          text = 'Error when generating text';
        } else {
          data.text.forEach((textEntry) => {
            if (textEntry.heading) {
              text += `${textEntry.heading}\n`;
            }
            text += `${textEntry.paragraph}\n\n`;
          });
          text = text.trim();
        }
        this.setState({ text });
      });
  }

  handleParagraphsChange(e) {
    this.setState({ paragraphs: e.target.value });
  }

  handleMinQuotesChange(e) {
    const minQuotes = e.target.value;
    this.setState((prevState) => {
      const newState = { minQuotes };
      const minQuotesAsInt = parseInt(minQuotes, 10);
      const maxQuotesAsInt = parseInt(prevState.maxQuotes, 10);
      if (minQuotesAsInt > maxQuotesAsInt) {
        newState.maxQuotes = minQuotes;
      }
      return newState;
    });
  }

  handleMaxQuotesChange(e) {
    const maxQuotes = e.target.value;
    this.setState((prevState) => {
      const newState = { maxQuotes };
      const maxQuotesAsInt = parseInt(maxQuotes, 10);
      const minQuotesAsInt = parseInt(prevState.minQuotes, 10);
      if (minQuotesAsInt > maxQuotesAsInt) {
        newState.minQuotes = maxQuotes;
      }
      return newState;
    });
  }

  handleHTagLevelChange(e) {
    this.setState({ hTagLevel: e.target.value });
  }

  handleIncludePTagsChange() {
    const { includePTags } = this.state;
    this.setState({ includePTags: !includePTags });
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    const {
      paragraphs,
      minQuotes,
      maxQuotes,
      hTagLevel,
      includePTags,
      text,
    } = this.state;

    return (
      <div className="App container text-center">
        <header className="row flex-center flex-middle">
          <img className="left no-border" src={carlosImg} alt="Carlos Matos" title="Carlos Matos" />
          <h1 className="col col-12 md-9">Bitconnect Carlos Ipsum</h1>
          <img className="right no-border" src={carlosImg} alt="Carlos Matos" title="Carlos Matos" />
        </header>
        <main className="row">
          <div className="col col-12 md-4 text-left">
            <form onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <label className="input-block" htmlFor="number-of-paragraphs">
                  Number of paragraphs:
                  <input
                    className="input-block"
                    type="number"
                    min="1"
                    max="100"
                    value={paragraphs}
                    onChange={this.handleParagraphsChange}
                    id="number-of-paragraphs"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="input-block" htmlFor="min-quotes-per-paragraph">
                  Minimum quotes per paragraph:
                  <input
                    className="input-block"
                    type="number"
                    min="1"
                    max="20"
                    value={minQuotes}
                    onChange={this.handleMinQuotesChange}
                    id="min-quotes-per-paragraph"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="input-block" htmlFor="max-quotes-per-paragraph">
                  Maximum quotes per paragraph:
                  <input
                    className="input-block"
                    type="number"
                    min="1"
                    max="20"
                    value={maxQuotes}
                    onChange={this.handleMaxQuotesChange}
                    id="max-quotes-per-paragraph"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="input-block" htmlFor="headings">
                  Headings:
                  <select
                    className="input-block"
                    id="headings"
                    value={hTagLevel}
                    onChange={this.handleHTagLevelChange}
                  >
                    <option value="none">none</option>
                    <option value="1">h1</option>
                    <option value="2">h2</option>
                    <option value="3">h3</option>
                    <option value="4">h4</option>
                    <option value="5">h5</option>
                    <option value="6">h6</option>
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label className="input-block paper-check" htmlFor="include-p-tags">
                  <input
                    className="input-block"
                    value={includePTags}
                    onChange={this.handleIncludePTagsChange}
                    type="checkbox"
                    name="p-tags"
                    id="include-p-tags"
                  />
                  <span>Include &lt;p&gt; tags</span>
                </label>
              </div>
              <button className="btn-block" type="submit">BITCONNEEEEEEEEEEEECT!</button>
            </form>
          </div>
          <div className="form-group col col-12 md-8">
            <textarea
              className="input-block padding no-resize"
              rows="20"
              value={text}
              onChange={this.handleTextChange}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
