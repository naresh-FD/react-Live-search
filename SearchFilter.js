import React, { Component } from 'react';
import axios from 'axios';
import Loader from './loader.gif';
class SearchFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: '',
			results: {},
			loading: false,
			message: ''
		};
		this.cancel = '';
	}

	HandleInputCHange = event => {
		const query = event.target.value;
		// console.log({ query });
		// this.setstate(
		//   {loading:true ,
		//  message: '',}
		// )
		if (!query) {
			this.setState({ query, results: {}, message: '' });
		} else {
			this.setState({ query, loading: true, message: '' }, () => {
				this.fetchSearchResults(1, query);
			});
		}
	};

	// fetching
	fetchSearchResults = (updatedPageNo = '', query) => {
		const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
		const searchUrl = `https://pixabay.com/api/?key=12413278-79b713c7e196c7a3defb5330e&q=${query}${pageNumber}`;
		if (this.cancel) {
			this.cancel.cancel();
		}

		this.cancel = axios.CancelToken.source();
		axios
			.get(searchUrl, {
				cancelToken: this.cancel.token
			})
			.then(res => {
				const resultNotFoundMsg = !res.data.hits.length
					? 'There are no more search results. Please try a new search.'
					: '';
				// console.log(res.data.hits);
				this.setState({
					results: res.data.hits,
					message: resultNotFoundMsg,
					loading: false
				});
			})
			.catch(error => {
				if (axios.isCancel(error) || error) {
					this.setState({
						loading: false,
						message: 'Failed to fetch results.Please check network'
					});
				}
			});
	};

	renderSearchResults = () => {
		const { results } = this.state;

		// console.log(results);
		if (Object.keys(results).length && results.length) {
			return (
				<div className='results-container row'>
					{results.map(result => {
						return (
							<div key={result.id} className='image-wrapper col col-md-3'>
								<a href={result.previewURL} className='result-items'>
									<h6 className='image-username'>{result.user}</h6>
									<img
										src={result.previewURL}
										alt={result.user}
										className='img-fluid img-responsive'
									/>
								</a>
							</div>
						);
					})}
				</div>
			);
		}
	};

	render() {
		const { query, loading, message } = this.state;
		return (
			<div className='container p-0 bg-danger'>
				<p className='text-center p-2 bg-danger'>Search</p>
				<div className='col-md-12 p-2'>
					<div className='input-group mb-3'>
						<input
							type='text'
							className='form-control'
							name='query'
							id='search-user'
							placeholder='Search...'
							onChange={this.HandleInputCHange}
						/>
					</div>
				</div>

				<div className='conatiner bg-primary'>
					{message && <p className='message'>{message}</p>}

					<img
						src='https://raw.githubusercontent.com/imranhsayed/react-workshop/live-search-react/src/loader.gif'
						className={`search-loading ${loading ? 'show' : 'hide'}`}
						alt='loader'
					/>

					<div className='col-md-12'>{this.renderSearchResults()}</div>
				</div>
			</div>
		);
	}
}

export default SearchFilter;
