import React, { useEffect, useState } from "react";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  News.defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
  };
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7b0f694f5bc1421ca5ccd6bf380c451a&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(60);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };

  useEffect(() => {
    document.title = "NewsNetwork - " + capitalizeFirstLetter(props.category);
    updateNews();
  }, []);

  // async componentDidMount() {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=7b0f694f5bc1421ca5ccd6bf380c451a&page=1&pageSize=${props.pageSize}`;
  //   this.setState({ loading: true });
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
  //   console.log(parsedData);
  //   this.setState({
  //     articles: parsedData.articles,
  //     totalResults: parsedData.totalResults,
  //     loading: false,
  //   });
  //   this.updateNews();
  // }

  // handlePrevClick = async () => {
  //   console.log("prev");
  //   let url = `https://newsapi.org/v2/top-headlines?country=${
  //     props.country
  //   }&category=${
  //     props.category
  //   }&apiKey=7b0f694f5bc1421ca5ccd6bf380c451a&page=${
  //     this.state.page - 1
  //   }&pageSize=${props.pageSize}`;
  //   this.setState({ loading: true });
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
  //   console.log(parsedData);
  //   this.setState({
  //     page: this.state.page - 1,
  //     articles: parsedData.articles,
  //     loading: false,
  //   });
  //   await this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // };
  // handleNextClick = async () => {
  //   console.log("next");
  //   if (
  //     !(
  //       this.state.page + 1 >
  //       Math.ceil(this.state.totalResults / props.pageSize)
  //     )
  //   ) {
  //     let url = `https://newsapi.org/v2/top-headlines?country=${
  //       props.country
  //     }&category=${
  //       props.category
  //     }&apiKey=7b0f694f5bc1421ca5ccd6bf380c451a&page=${
  //       this.state.page + 1
  //     }&pageSize=${props.pageSize}`;
  //     this.setState({ loading: true });
  //     let data = await fetch(url);
  //     let parsedData = await data.json();
  //     this.setState({
  //       page: this.state.page + 1,
  //       articles: parsedData.articles,
  //       loading: false,
  //     });
  //   }
  //   await this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=7b0f694f5bc1421ca5ccd6bf380c451a&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <div className="container my-3">
      <>
        <h1 className="text-center font" style={{ marginTop: "70px" }}>
          NewsNetwork - Top Headlines
        </h1>
        <h4 className="text-center" style={{ fontWeight: 700 }}>
          {capitalizeFirstLetter(props.category)}
        </h4>

        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container my-3">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    </div>
  );
};

export default News;
