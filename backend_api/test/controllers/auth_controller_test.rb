require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "should get me when authenticated" do
    token = JsonWebToken.encode(user_id: @user.id)
    get me_url, headers: { "Authorization" => "Bearer #{token}" }, as: :json
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal @user.id, json["user"]["id"]
  end

  test "should fail get me when unauthorized" do
    get me_url, as: :json
    assert_response :unauthorized
  end

  test "should fail telegram login with missing initData" do
    post auth_telegram_url, params: {}, as: :json
    assert_response :bad_request
  end

  test "should fail telegram login with invalid signature" do
    post auth_telegram_url, params: { initData: "query_id=123&user={}&auth_date=1700000000&hash=wrong" }, as: :json
    assert_response :unauthorized
  end
end
