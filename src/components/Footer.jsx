export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-8">
      <p>© {new Date().getFullYear()} RedeemX. All rights reserved.</p>
      <p class="text-sm text-gray-500 mt-2">Made by <a href="https://t.me/Jameswarden212" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-blue-500 hover:underline"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M9.999 15.5l-.393 5.551c.561 0 .806-.242 1.099-.53l2.636-2.508 5.466 3.982c1.002.553 1.715.263 1.962-.927l3.562-16.717c.361-1.697-.613-2.363-1.678-1.951L1.616 9.581c-1.644.657-1.619 1.6-.28 2.018l5.255 1.642L18.72 6.96c.613-.38 1.172-.17.713.21"/></svg>James Warden</a></p>


    </footer>
  );
}
