const Footer = () => {
  return (
    <footer className="bg-ink text-paper border-t border-[rgba(243,239,230,0.14)] px-6 md:px-10 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-lg mb-3">JATIN MEN'S WEAR</div>
          <p className="text-paper/50 text-xs leading-relaxed">
            Premium menswear crafted for everyday style. Est. 2015.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <span className="text-paper/40 tracking-wider mb-1">COMPANY</span>
          <a href="#" className="hover:text-tangerine transition-colors">About us</a>
          <a href="#" className="hover:text-tangerine transition-colors">Contact</a>
          <a href="https://github.com/jatin50" className="hover:text-tangerine transition-colors">Github</a>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <span className="text-paper/40 tracking-wider mb-1">SUPPORT</span>
          <a href="#" className="hover:text-tangerine transition-colors">Customer support</a>
          <a href="#" className="hover:text-tangerine transition-colors">Shipping & returns</a>
          <a href="#" className="hover:text-tangerine transition-colors">FAQs</a>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <span className="text-paper/40 tracking-wider mb-1">LEGAL</span>
          <a href="#" className="hover:text-tangerine transition-colors">Terms & conditions</a>
          <a href="#" className="hover:text-tangerine transition-colors">Privacy policy</a>
          <a href="#" className="hover:text-tangerine transition-colors">Instagram</a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-[rgba(243,239,230,0.08)] text-[11px] text-paper/30 flex justify-between">
        <span>© 2026 Jatin Men's Wear</span>
        <span>Made for the streets</span>
      </div>
    </footer>
  );
};
export default Footer;