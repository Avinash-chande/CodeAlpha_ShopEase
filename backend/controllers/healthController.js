/**
 * @desc   Check API health status
 * @route  GET /api/health
 * @access Public
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ShopEase API is running',
    timestamp: new Date().toISOString()
  });
};
