/**
 * 错误响应工具类
 * 
 * 用于创建统一的错误响应对象，确保API错误格式一致
 */

/**
 * 自定义错误类
 * @extends Error
 */
class ErrorResponse extends Error {
  /**
   * 创建一个错误响应
   * @param {string} message - 错误消息
   * @param {number} statusCode - HTTP状态码
   * @param {string} errorCode - 错误代码，用于前端识别
   */
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || this.getDefaultErrorCode(statusCode);
  }

  /**
   * 根据HTTP状态码获取默认错误代码
   * @param {number} statusCode - HTTP状态码
   * @returns {string} 默认错误代码
   */
  getDefaultErrorCode(statusCode) {
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      case 500:
      default:
        return 'SERVER_ERROR';
    }
  }

  /**
   * 转换为JSON格式
   * @returns {Object} 标准化的错误响应对象
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message
      }
    };
  }
}

module.exports = ErrorResponse; 