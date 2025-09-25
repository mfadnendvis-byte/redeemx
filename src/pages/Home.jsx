import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Welcome to RedeemX 🎁
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Redeem your gift cards easily, track your wallet, and withdraw securely
          to PayPal or USDT. Fast. Reliable. Simple.
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-300"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
          >
            Go to Dashboard
          </Link>
        )}
      </section>

      {/* Features */}
      <section className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="p-6 border rounded-xl shadow hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">💳 Redeem Gift Cards</h3>
          <p className="text-gray-600">
            Submit your gift cards quickly, and get instant wallet credit upon providers approval.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">💰 Wallet Balance</h3>
          <p className="text-gray-600">
            Keep track of your transactions and available balance in real time.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">⚡ Fast Withdrawals</h3>
          <p className="text-gray-600">
            Withdraw securely to PayPal or USDT — usually takes a few minutes.
          </p>
        </div>
      </section>

      {/* Our Partners */}
<section className="mt-16">
  <h2 className="text-2xl font-bold mb-6">🌍 Our Trusted Partners</h2>
  <div className="grid grid-cols-2 md:grid-cols-6 gap-10 items-center justify-center">
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        alt="Apple"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">Apple</span>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg"
        alt="Walmart"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">Walmart</span>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Amazon_icon.svg"
        alt="Amazon"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">Amazon</span>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Ebay_logo.svg"
        alt="eBay"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">eBay</span>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/2d/GameStop_Logo.svg"
        alt="GameStop"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">GameStop</span>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Razer_logo.svg"
        alt="Razer"
        className="h-12 mb-2"
      />
      <span className="text-gray-700 font-medium">Razer</span>
    </div>
  </div>
</section>


      {/* Testimonials */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">💬 What Our Users Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white border rounded-xl shadow">
            <p className="text-gray-700 mb-4">
              “RedeemX made it so easy to cash out my gift cards. Fast approval
              and smooth withdrawal to PayPal!”
            </p>
            <span className="font-semibold text-blue-600">— Sarah K.</span>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow">
            <p className="text-gray-700 mb-4">
              “I love the simple dashboard. I can track my balance and history
              without any hassle.”
            </p>
            <span className="font-semibold text-blue-600">— James T.</span>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow">
            <p className="text-gray-700 mb-4">
              “Great service and amazing support. Highly recommended for anyone
              who redeems gift cards often.”
            </p>
            <span className="font-semibold text-blue-600">— Aisha M.</span>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="mt-20 py-12 bg-blue-600 text-white rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-4">
          Ready to turn your gift cards into cash?
        </h2>
        <p className="mb-6">
          Join thousands of happy users already redeeming with RedeemX.
        </p>
        {!user ? (
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow hover:bg-gray-100"
          >
            Get Started Now
          </Link>
        ) : (
          <Link
            to="/dashboard"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow hover:bg-gray-100"
          >
            Go to Dashboard
          </Link>
        )}
      </section>
    </div>
  );
}
