export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-8">
      <p>© {new Date().getFullYear()} RedeemX. All rights reserved.</p>
       <p className="mt-2">
        Contact us:{" "}
        <a
          href="mailto:customerservice@redeemx.world"
          className="text-blue-400 hover:underline"
        >
          customerservice@redeemx.world
        </a>
      </p>


    </footer>
  );
}
