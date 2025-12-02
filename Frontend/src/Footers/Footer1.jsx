import React from 'react'

const Footer1 = () => {
  return (
    <>
    <footer className="lx-footer relative bg-gray-950/90 px-4 py-8 text-center text-[#f4f4f4] border-t-1  shadow-lg b">
        <div className="lx-footer__subscribe">
          <h3 className="mb-4 font-medium">
            Stay up to date on the latest from SkillFusion
          </h3>
        </div>

        <div className="lx-footer__social mt-8">
          <h4 className="mb-4 font-semibold">Follow SkillFusion </h4>
          <div className="lx-footer__icons flex justify-center gap-2">
            {[
              { icon: "fab fa-facebook-f", url: "#" },
              { icon: "fab fa-linkedin-in", url: "#" },
              { icon: "fab fa-instagram", url: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-black text-[1.2rem] transition-transform duration-300 hover:scale-110"
              >
                <i className={item.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="lx-footer__meta mt-8 text-[#b3b3b3]">
          <p>
            <br />
          </p>
          <p className="text-[0.9rem]">
            Copyright © {new Date().getFullYear()} All rights reserved | Made{" "}
            <span className="text-red-600"></span> by{" "}
            <a href="#" className="text-[#00aaff]">
              SkillFusion
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer1
