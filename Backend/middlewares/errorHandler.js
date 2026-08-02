export const errorHandler = (err,req,res,next)=>{
    let error = {...err};
    error.message = err.message;

    console.error("error Stack", err);
    
    // bad objectId (CAST ERROR OR DATA TYPE IS DIFFF)
    if(err.name === "CastError"){
        error.message = `Resource not found with id: ${err.value}` ;
        error.statusCode = 404 ;
    }
    //mongo duplicate key errror
    if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate value entered for '${field}'. Please use another value.`;
    error.statusCode = 400;
  }

    // mongo validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Authentication token expired';
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
}