'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Users 모델을 참조합니다.
          key: 'userId', // Users 모델의 userId를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면, Posts 모델의 데이터가 삭제됩니다.
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      postImage: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING, //게시물 이미지 저장위해 추가
      },
      content: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  },
};
