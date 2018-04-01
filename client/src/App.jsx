import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hTagLevel: 'none',
      paragraphs: 1,
      minQuotes: 1,
      maxQuotes: 5,
      includePTags: false,
      text: '',
    };

    this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
    this.handleHTagLevelChange = this.handleHTagLevelChange.bind(this);
    this.handleIncludePTagsChange = this.handleIncludePTagsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMinQuotesChange = this.handleMinQuotesChange.bind(this);
    this.handleMaxQuotesChange = this.handleMaxQuotesChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let url = '/api/text' +
    `?paragraphs=${this.state.paragraphs}` +
    `&includeHeadings=${this.state.hTagLevel !== 'none'}` +
    `&minQuotes=${this.state.minQuotes}` +
    `&maxQuotes=${this.state.maxQuotes}` +
    `&includePTags=${this.state.includePTags}`;

    if (this.state.hTagLevel !== 'none') {
      url += `&hTagLevel=${this.state.hTagLevel}`;
    }

    fetch(url)
      .then(res => res.json())
      .then((data) => {
        let text = '';
        if (!data.text) {
          text = 'Could not generate text';
        } else {
          data.text.forEach((textEntry) => {
            if (textEntry.heading) {
              text += `${textEntry.heading}\n`;
            }
            text += textEntry.paragraph;
            text += '\n\n';
          });
        }
        this.setState({
          text,
        });
      });
  }

  handleParagraphsChange(e) {
    this.setState({
      paragraphs: e.target.value,
    });
  }

  handleHTagLevelChange(e) {
    this.setState({
      hTagLevel: e.target.value,
    });
  }

  handleIncludePTagsChange() {
    this.setState({
      includePTags: !this.state.includePTags,
    });
  }

  handleMinQuotesChange(e) {
    this.setState({
      minQuotes: e.target.value,
    });
  }

  handleMaxQuotesChange(e) {
    this.setState({
      maxQuotes: e.target.value,
    });
  }

  render() {
    return (
      <div className="App text-center">
        <h1>Bitconnect Carlos Ipsum</h1>
        <div className="row">
          <form onSubmit={this.handleSubmit} className="md-3 text-left">
            <div className="form-group">
              <label htmlFor="paperInputs1">Number of paragraphs
                <input type="number" min="1" max="100" value={this.state.paragraphs} onChange={this.handleParagraphsChange} id="paperInputs1" />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="paperInputs1">Min quotes per paragraph
                <input type="number" min="1" max="20" value={this.state.minQuotes} onChange={this.handleMinQuotesChange} id="paperInputs1" />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="paperInputs1">Max quotes per paragraph
                <input type="number" min="1" max="20" value={this.state.maxQuotes} onChange={this.handleMaxQuotesChange} id="paperInputs1" />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="paperSelects1">Headings
                <select id="paperSelects1" value={this.state.hTagLevel} onChange={this.handleHTagLevelChange}>
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
              <label htmlFor="paperChecks1" className="paper-check">
                <input value={this.state.includePTags} onChange={this.handleIncludePTagsChange} type="checkbox" name="paperChecks" id="paperChecks1" /> <span>Include &lt;p&gt; tags</span>
              </label>
            </div>
            <button type="submit">BITCONNEEEEEEEEEEEECT!</button>
          </form>
          <textarea className="md-9" value={this.state.text} />
        </div>
      </div>
    );
  }
}

export default App;
