to create a error boundary 

LazyLoading.js -->

import React, { Suspense } from 'react';
import ErrorBoundary from '../../containers/ErrorBoundary';
import Loading from '../Loading/loading';

export const withLazyComponent = (LazyComponent) => {
  return (props) => (
    <Suspense fallback={<Loading/>}>
      {console.log('lazyload.js')}
      {/* <ErrorBoundary> */}
      <LazyComponent {...props} />
      {/* </ErrorBoundary> */}
    </Suspense>
  )
}


ErrorBoundary.js -->

import React, { Component } from 'react'
import bannerIcon from "../assets/images/feature.png";

 class ErrorBoundary extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         hasError:false
      }
    }

    static getDerivedStateFromError(error){
        return{
            hasError:true
        }
    }
    componentDidCatch(err,info){
        console.log(err,info);

    }

  render() {
    // const{t} = this.props
    return (
      this.state.hasError ? <div className="container mt-4">
      <div className="row justify-content-center">
      <div className="text-center">
      <img
            src={bannerIcon}
            alt=""
            style={{ top: 0, height: '280px' }}
          />
          <h2 className="my-3">{"Something went wrong"}</h2>
          <p className="mt-2 mb-1 normal">
            {/* {t('featureNotFound.bottomText')} */}
            {"Something went wrong"}
          </p>
          <p className="mt-2 mb-1 normal">
            {/* {t('featureNotFound.bottomText1')} */}
            {"Please try after some time"}
          </p>
        </div>
      </div>
    </div>:this.props.children
    )
  }
}

export default ErrorBoundary