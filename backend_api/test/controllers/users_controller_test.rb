require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = { "Authorization" => "Bearer #{JsonWebToken.encode(user_id: @user.id)}" }
  end

  test "should get index when authenticated" do
    get users_url, headers: @headers, as: :json

    assert_response :success
  end

  test "should reject index when unauthenticated" do
    get users_url, as: :json

    assert_response :unauthorized
  end

  test "should create user when authenticated" do
    assert_difference("User.count") do
      post users_url,
           params: {
             user: {
               username: "testuser",
               fullname: "Test User",
               phone_number: "+251911000003",
               telegram_id: "555000333",
               first_name: "Test",
               last_name: "User"
             }
           },
           headers: @headers,
           as: :json
    end

    assert_response :created
  end

  test "should not create user without telegram id" do
    post users_url,
         params: {
           user: {
             username: "missingtelegram",
             fullname: "Missing Telegram",
             phone_number: "+251911000004"
           }
         },
         headers: @headers,
         as: :json

    assert_response :unprocessable_entity
  end
end
